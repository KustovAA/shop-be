type Response = {
    statusCode: number
    headers?: Record<string, string>,
    body?: Record<string, any>
}

type ResultResponse = Omit<Response, 'body'> & {
    body: string
}

const defaultHeaders = {
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*'
};

export class ResponseService {
    success(response: Response): ResultResponse {
        return {
            ...response,
            headers: {
                ...defaultHeaders,
                ...response.headers
            },
            body: JSON.stringify(response.body)
        }
    }

    error(err: Error, response: Response): ResultResponse {
        return {
            ...response,
            headers: {
                ...defaultHeaders,
                ...response.headers
            },
            body: JSON.stringify( {
                message: err.message,
                ...response.body,
            })
        }
    }
}
