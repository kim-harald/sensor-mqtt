import { AsyncMqttClient, connectAsync, IClientOptions } from 'async-mqtt'
import { Observable } from 'rxjs'
import { Reading } from '../models/reading'
import { WLogger } from './loggerservice'

let client: AsyncMqttClient
let baseTopic: string
const topics: Record<string, string> = {}

const init = async (
  brokerUri: string,
  topic: string,
  username: string,
  password: string,
) => {
  const options = {
    username,
    password,
    rejectUnauthorized: false,
  } as IClientOptions
  client = await connectAsync(brokerUri, options)
  baseTopic = topic
}

const send = async (readingType: ReadingType, data: any): Promise<boolean> => {
  topics[readingType] = baseTopic + '/' + readingType
  const json = ['all', 'trend', 'sync'].includes(readingType)
    ? JSON.stringify(data)
    : data.toString()
  await client.publish(topics[readingType], json, { retain: true, qos: 1 })
  WLogger.debug(`Data sent to ${topics[readingType]}`)
  return true
}

const close = async () => {
  Object.keys(topics).forEach((key) => {
    client.unsubscribe(topics[key])
  })
}

const subscribeTopic = (
  readingType: ReadingType,
): Observable<number | Reading> => {
  topics[readingType] = baseTopic + '/' + readingType

  client.subscribe(topics[readingType])
  return new Observable<number | Reading>((s) => {
    client.on('message', (topic: string, buffer: Buffer) => {
      const data = Buffer.from(buffer)
      const json = JSON.parse(data.toString())
      if (readingType !== 'all') {
        const x = json as Reading
        s.next(x)
      }

      const y = Number(json)
      s.next(y)
    })
  })
}

export type ReadingType =
  | 'temperature'
  | 'pressure'
  | 'humidity'
  | 'all'
  | 'trend'
  | 'sync'
export const MqqtService = { init, send, close, subscribeTopic }
