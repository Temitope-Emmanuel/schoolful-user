import {useParams} from "react-router-dom"


interface IParams {
    churchId:string
}
// eslint-disable-next-line
export default () => {
    const history:IParams = useParams()

    return history
}