import express from 'express'
import axios from "axios"


const routerLocation = express.Router()


async function getLocartionCoordinates(locationName) {
    const response = await axios.get(`https://positionstack.com/geo_api.php?query=${locationName}`)
    if (response.data.data && response.data.data.length > 0) {
        const firsResult = response.data.data[0]
        console.log(firsResult);
        return {
            longitude: firsResult.longitude,
            latitude: firsResult.latitude

        }

    }

    return null

}

routerLocation.get('/getResiLocation', async (req, res) => {
    const courier = req.query.courier
    const awb = req.query.awb
    try {
        const response = await axios.get(`https://api.binderbyte.com/v1/track?api_key=${process.env.API_KEY}&courier=${courier}&awb=${awb}`)
      
       const responseData = response.data.data.history.filter((items) =>{
            return items.location !== undefined && items.location !== ''
        })

        if (Array.isArray(responseData) && responseData.length > 0) {
            const firstData = responseData[responseData.length - 1].location
            const lastData = responseData[0].location

            if (firstData !== '' || lastData !== '') {

                const startLocationCoordinates = await getLocartionCoordinates(firstData)
                const endLocationCoordinates = await getLocartionCoordinates(lastData)

                res.status(200).json({
                    message: 'success',
                    firstData,
                    lastData,
                    startLocationCoordinates,
                    endLocationCoordinates
                })

            } else {

                let nonEmptyLocationData = responseData.find(data => data.location !== '')

                if (nonEmptyLocationData) {
                    const startLocationCoordinates = await getLocartionCoordinates(nonEmptyLocationData)
                    const endLocationCoordinates = await getLocartionCoordinates(lastData)
                    res.status(200).json({
                        message: 'success',
                        firstData: nonEmptyLocationData,
                        lastData,
                        startLocationCoordinates,
                        endLocationCoordinates
                    })

                } else {

                    res.status(200).json({
                        message: 'success',
                        data: "Lokasi Tidak Ditemukan"
                    })
                }
            }

        } else {
            res.status(200).json({
                message: 'success',
                data: "Array data kosong."
            })

        }

    } catch (error) {
        res.status(500).json({
            message: 'error',
            error: error.message
        })
    }
})

export default routerLocation