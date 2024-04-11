import axios from 'axios'
import mondaySdk from "monday-sdk-js"

export async function postConsulta(userDTO){
  const monday = mondaySdk();
  monday.setApiVersion("2024-01");
  monday.setToken('eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI4MzUzMjQ4MSwiYWFpIjoxMSwidWlkIjo0NDQ4MzAzMCwiaWFkIjoiMjAyMy0wOS0yMVQxODo1OTo0Mi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTcyMTM5MDIsInJnbiI6InVzZTEifQ.44jWSoWM8S5yCvSi57Yzo49eex66RzxQwUx_6LSUEsU')
    
  const {name,mail, telefono,consulta } = userDTO;

  const column_values = JSON.stringify({
      texto0__1: mail,
      tel_fono__1:telefono,
      texto6__1 :consulta
  });

    const query = `mutation{
        create_item (board_id:"6342754164",item_name:"francisco",column_values:"{name:\"francisco\"texto0__1:"ghisonifran@gmail.com",tel_fono__1:"1123202551",texto6__1:"probando"}") {
          id
        }}`
    const data = {
      query:`mutation{create_item(board_id:6342754164,item_name:${name},column_values:"${column_values}"){id}}`
    }
    

  try {
    const lead = await monday.api(`
    mutation {
      create_item(
        board_id:6342754164,
        item_name:"${name}"
        ) { 
        id 
      }
    }
  `)
    console.log("response.data ",lead);
    console.log("response.data.create_item.id ",lead.data.create_item.id);
    await monday.api(`
    mutation{
      change_simple_column_value(
        item_id:${lead.data.create_item.id},
        board_id:6342754164,
        column_id:"texto0__1",
        value: "${mail}" 
      ){
        id
      }
    }`)
    await monday.api(`
    mutation{
      change_simple_column_value(
        item_id:${lead.data.create_item.id},
        board_id:6342754164,
        column_id:"tel_fono__1",
        value: "${telefono}" 
      ){
        id
      }
    }`)
    await monday.api(`
    mutation{
      change_simple_column_value(
        item_id:${lead.data.create_item.id},
        board_id:6342754164,
        column_id:"texto6__1",
        value: "${consulta}" 
      ){
        id
      }
    }`)
    console.log("response.data ",);
    return lead

  } catch (error) {
    console.error(error);
    return error
  }
}