import { attachStatus } from '.'

import { BACKEND_URL } from '../../constants/backend'

export const generateDescription = async (image: any) => {
  const formDataToSend = new FormData()

  formDataToSend.append('image', image)
  const res = await fetch(`${BACKEND_URL}/products/generateTextForImage`, {
    method: 'POST',
    body: formDataToSend,
    credentials: 'include',
    cache: 'no-cache',
  })
  return attachStatus(res)
}
