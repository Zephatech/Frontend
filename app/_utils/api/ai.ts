import { attachStatus } from '.'

export const generateDescription = async (image: any) => {
    const formDataToSend = new FormData()

    formDataToSend.append('image', image)
    const res = await fetch(
        'http://localhost:3001/products/generateTextForImage',
        {
            method: 'POST',
            body: formDataToSend,
            credentials: 'include',
            cache: 'no-cache',
        }
    )
    return attachStatus(res)
}
