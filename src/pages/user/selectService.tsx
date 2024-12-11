import SelectService from "../../components/user/selectService";


function SelectServicePage(prop:{value:string}){
    return(<SelectService value={prop.value}/>)
}

export default SelectServicePage