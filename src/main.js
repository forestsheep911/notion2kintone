import { Client } from '@notionhq/client'

const notion = new Client({ auth: 'secret_CNqoK82a5MQaBosS6jMEchHbQhX2806zNljRgShGuK' })

// const urlQueryDB = 'https://api.notion.com/v1/databases/b269009a9a44488d9ff7fe0c646179c9/query'
// const urlRetrieveSinglePage = 'https://api.notion.com/v1/pages/'

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
            // console.log(properties[propertyName].results)
            // console.log(properties[propertyName].results[0])
            if (properties[propertyName].results[0].type === 'title') {
              // console.log(properties[propertyName].results[0][properties[propertyName].results[0].id].plain_text)
            }
          }
          if (propertyName === 'Name') {
            // console.log(properties.Name.results[0].title.plain_text)
            return { Name: properties.Name.results[0].title.plain_text }
          }
          if (propertyName === 'sele') {
            // console.log(properties.sele.select.name)
            return { Tags: properties.sele.select.name }
          }
          // return properties
          // return {}
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
    if (value && value.Name) {
      // console.log(value.Name)
      record.Name = { value: value.Name }
    }
    if (value && value.Tags) {
      // console.log(value.Name)
      record.Tags = { value: value.Tags }
    }
    delete record[key]
  }
}
console.log(preResult.records)
