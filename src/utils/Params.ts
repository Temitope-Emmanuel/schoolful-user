import {useParams} from "react-router-dom"


interface IParams {
    churchId:string
}

export default () => {
    const history:IParams = useParams()

    return history
}