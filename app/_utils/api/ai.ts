import { attachStatus } from '.'

export const generateDescription = async (image: any) => {
  const formDataToSend = new FormData()

  formDataToSend.append('image', image)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_PREFIX}/products/generateTextForImage`,
    {
      method: 'POST',
      body: formDataToSend,
      credentials: 'include',
      cache: 'no-cache',
    }
  )
  return attachStatus(res)
}
