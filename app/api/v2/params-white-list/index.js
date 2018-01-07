

// import Topic from 'topic'

export default (dataJSON, { queryWhiteList, selectWhiteList, optionsWhiteList, updateWhiteList }) => {

  let queryJSON = dataJSON.query || {}
  let selectJSON = dataJSON.select || {}
  let optionsJSON = dataJSON.options || {}
  let updateJSON = dataJSON.update || {}

  let query = {}, select = {}, options = {}, update = {}

  for (let i in queryJSON) {
    if (queryWhiteList[i]) {
      let result = queryWhiteList[i](queryJSON[i])
      if (result && result.err) {
        return { success: false, error: result.err }
      } else {
        query[result.name] = result.value
      }
    }
  }

  if (Reflect.ownKeys(selectJSON).length > 0) {
    for (let i in selectJSON) {
      if (selectWhiteList.indexOf(i) != -1) {
        select[i] = parseInt(selectJSON[i])
      } else {
        return { success: false, error: 90001, error_data: { params:i } }
      }
    }
  } else {
    selectWhiteList.map(item=>{
      select[item] = 1
    })
  }

  for (let i in optionsJSON) {
    if (optionsWhiteList[i]) {
      let result = optionsWhiteList[i](optionsJSON[i])
      if (result && result.err) {
        return { success: false, error: result.err }
      } else {
        options[result.name] = result.value
      }
    }
  }



  for (let i in updateJSON) {

    if (updateWhiteList[i]) {

      let result = updateWhiteList[i](updateJSON[i])

      if (result && result.error) {
        result.success = false
        return result
      } else {
        update[result.name] = result.value
      }
    }
  }


  // console.log(update);

  return { query, select, options, update }

}
