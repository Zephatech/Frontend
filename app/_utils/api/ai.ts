import { attachStatus } from '.'

import { BACKEND_URL } from '../../constants/backend'

export const generateDescription = async (image: any) => {
  const formDataToSend = new FormData()

<<<<<<< HEAD
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
=======
    formDataToSend.append('image', image)
    const res = await fetch('${BACKEND_URL}/products/generateTextForImage', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
        cache: 'no-cache',
    })
    return attachStatus(res)
>>>>>>> b004859 (Initialize for deployment)
}
