export const attachStatus = async (
    res: Response,
    successCode: number = 200
) => {
    const data = await res.json()
    data.success = res.status == successCode
    return data
}
