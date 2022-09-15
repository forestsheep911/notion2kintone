import got from 'got'
// const { Client } = require('@notionhq/client')
import { Client } from '@notionhq/client'

const notion = new Client({ auth: 'secret_CNqoK82a5MQaBosS6jMEchHbQhX2806zNljRgShGuK' })

const urlQueryDB = 'https://api.notion.com/v1/databases/b269009a9a44488d9ff7fe0c646179c9/query'
const urlRetrieveSinglePage = 'https://api.notion.com/v1/pages/'

const queryDatabase = async (dbid) => {
  // const data = await got.post(urlQueryDB, {
  //   headers: {
  //     'Notion-Version': '2022-06-28',
  //     Authorization: 'secret_CNqoK82a5MQaBosS6jMEchHbQhX2806zNljRgShGuK',
  //   },
  // })
  // return data.body
  const response = await notion.databases.query({
    database_id: dbid,
  })
  return response
}

const retrieveSinglePage = async (pgid) => {
  // const data = await got.get(`${urlRetrieveSinglePage}${page_id}`, {
  //   headers: {
  //     'Notion-Version': '2022-06-28',
  //     Authorization: 'secret_CNqoK82a5MQaBosS6jMEchHbQhX2806zNljRgShGuK',
  //   },
  // })
  // return JSON.parse(data.body)
  const response = await notion.pages.retrieve({
    page_id: pgid,
  })
  return response
}

const mainLoop = async () => {
  const res = await queryDatabase('b269009a9a44488d9ff7fe0c646179c9')
  const v = await Promise.all(
    res.results.map(async (page) => {
      // const prop = (await retrieveSinglePage(page.id)).properties
      const properties = {}
      for (const propertyName of Object.keys(page.properties)) {
        const propertyData = await notion.pages.properties.retrieve({
          page_id: page.id,
          property_id: page.properties[propertyName].id,
        })
        properties[propertyName] = propertyData
        // console.log(properties[propertyName])
        if (properties[propertyName].object !== 'list')
          // console.log(properties[propertyName].results[0][properties[propertyName].results[0].type].plain_text)
          console.log(properties[propertyName])
      }
      // console.log(properties)
      // console.log(properties.Tags.multi_select)
      // console.log(properties.Name.results)

      return properties
    }),
  )
  // console.log(v)
}
mainLoop()
