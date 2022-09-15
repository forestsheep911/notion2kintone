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
      const t = await Promise.all(
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
          }
          return properties
        }),
      )
      return t
    }),
  )
  console.log(propertitsSet)
}
iterateDB()
