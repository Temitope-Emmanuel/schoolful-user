import React from "react"



const useImageState = () => {
    const [image, setImage] = React.useState({
        name: "",
        base64: ""
    })
    const handleImageTransformation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setImage({ ...image, base64: (reader.result as string), name: file.name })
            }
            reader.readAsDataURL(file)
        }
    }
    const resetImage = () => {
        setImage({
            name:"",
            base64:""
        })
    }

    return {image,resetImage,handleImageTransformation}
}

export {useImageState}