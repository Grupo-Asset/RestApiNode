import axios from 'axios'
export class FunnelModel {

    static async getFunnel(){
        return "xd"
    }

    static async postUser(req){
        console.log("postUser:",req.body)
        const options = {
            method: 'POST',
            url: 'https://api.holded.com/api/crm/v1/leads',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
            },
            data: {
                funnelId: req.body.funnelID,
                contactId: req.body.usuario.id,
                stageId: req.body.stageID
            }
            };
        
            axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
                return {status: "suscripcion fallida", error: true}
            });

            return {status: "suscripcion exitosa", error: false}
    }
}