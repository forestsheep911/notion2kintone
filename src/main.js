import { Client } from '@notionhq/client'
import { KintoneRestAPIClient } from '@kintone/rest-api-client'

const notion = new Client({ auth: 'secret_CNqoK82a5MQaBosS6jMEchHbQhX2806zNljRgShGuK' })

const queryDatabase = async (dbid) => {
  const response = await notion.databases.query({
    database_id: dbid,
  })
  return response
}

const retrieveSinglePage = async (pgid) => {
  const response = await notion.pages.retrieve({
    page_id: pgid,
  })
  return response
}

const iterateDB = async () => {
  const dbArray = await await notion.databases.query({ database_id: 'b269009a9a44488d9ff7fe0c646179c9' })
  const propertitsSet = await Promise.all(
    dbArray.results.map(async (pageRecord) => {
      const record = await Promise.all(
        Object.keys(pageRecord.properties).map(async (propertyName) => {
          // console.log(propertyName)
          const properties = {}
          const propertyData = await notion.pages.properties.retrieve({
            page_id: pageRecord.id,
            property_id: pageRecord.properties[propertyName].id,
          })
          properties[propertyName] = propertyData
          // console.log(properties)
          if (properties[propertyName].object === 'list') {
            // console.log(properties[propertyName].results[0])
            if (properties[propertyName].results[0].type === 'title') {
              // console.log(properties[propertyName].results[0][properties[propertyName].results[0].id].plain_text)
            }
          }
          if (propertyName === '书名') {
            // console.log(properties.Name.results[0].title.plain_text)
            return { book_name: properties.书名.results[0].title.plain_text }
          }
          if (propertyName === '作者') {
            // console.log(properties.作者.results[0].rich_text.plain_text)
            return { author: properties.作者.results[0].rich_text.plain_text }
          }
          if (propertyName === '定价') {
            // console.log(properties.定价)
            return { price: properties.定价.number }
          }
          if (propertyName === '标签') {
            return {
              label: properties.标签.multi_select.map((m) => {
                return m.name
              }),
            }
            // for (const label of properties.标签.multi_select) {
            //   console.log(label.name)
            // }
            // return { 作者: properties.作者.results[0].rich_text.plain_text }
          }
          // return properties
        }),
      )
      return { ...record }
    }),
  )
  // console.log({ records: propertitsSet })
  return { records: propertitsSet }
}
const preResult = await iterateDB()
// console.log(preResult)

for (const record of preResult.records) {
  for (const [key, value] of Object.entries(record)) {
    // console.log(value)
    if (value && value.book_name) {
      record.book_name = { value: value.book_name }
    }
    if (value && value.author) {
      record.author = { value: value.author }
    }
    if (value && value.price) {
      record.price = { value: value.price }
    }
    if (value && value.label) {
      record.label = { value: value.label }
    }
    delete record[key]
  }
}
preResult.app = 43
console.log(preResult.records)

const client = new KintoneRestAPIClient({
  baseUrl: 'https://cndevqpofif.cybozu.cn',
  auth: {
    apiToken: 'WKuCUxqW8gRYrgs57w5UVAU9GUKYPbTU210MJ0bx',
  },
})

const addedToKintone = await client.record.addRecords(preResult)
console.log(addedToKintone)
