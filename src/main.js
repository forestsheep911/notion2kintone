import { Client } from '@notionhq/client'

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
          if (propertyData.object === 'list' && propertyData.results.length > 0) {
            if (propertyData.results[0].type === 'title') {
              return { [propertyName]: propertyData.results[0].title.plain_text }
            } else if (propertyData.results[0].type === 'rich_text') {
              return {
                [propertyName]: propertyData.results[0].rich_text.plain_text,
              }
            }
          } else if (propertyData.type === 'multi_select') {
            return {
              [propertyName]: propertyData.multi_select.map((p) => {
                return p.name
              }),
            }
          } else if (propertyData.type === 'number') {
            return {
              [propertyName]: propertyData.number,
            }
          }
        }),
      )
      return { ...record }
    }),
  )
  return { records: propertitsSet }
}
const preResult = await iterateDB()

for (const record of preResult.records) {
  for (const [key, value] of Object.entries(record)) {
    if (value) {
      record[Object.keys(value)[0]] = { value: Object.values(value)[0] }
    }
    delete record[key]
  }
}
preResult.records.map((e) => {
  console.log(e)
})
