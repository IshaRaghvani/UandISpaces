import axios from 'axios';


const GetAllLeads=()=>axios.get('/api/leads');


const CreateNewLead=(data)=>axios.post('/api/newLead',data)


export default{
    GetAllLeads,
    CreateNewLead
} 