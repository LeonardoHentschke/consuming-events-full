import fastify, {FastifyReply} from "fastify";
import axios from "axios";
import {ZodTypeProvider} from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

const authHeader = () => ({
    headers: {
        Authorization: `Basic ${Buffer.from('Tyrion:wine').toString('base64')}`
    }
});

const errorHandler = (reply: FastifyReply, errorMessage: string) => {
    reply.status(500).send({error: errorMessage});
};

app.get('/consuming/subscriptions/:userId', async (req, reply) => {
    try {
        // @ts-ignore
        const userId = req.params.userId;
        const {data} = await axios.get(`http://localhost:3333/subscriptions/${userId}`, authHeader());
        reply.send(data);
    } catch (error) {
        // @ts-ignore
        errorHandler(reply, error.response.data);
    }
});

app.post('/consuming/subscribe', async (req, reply) => {
    try {
        // @ts-ignore
        const {userId, eventId} = req.body;
        const {data} = await axios.post('http://localhost:3333/subscribe', {userId, eventId}, authHeader());
        reply.send(data);
    } catch (error) {
        // @ts-ignore
        errorHandler(reply, error.response.data);
    }
});

app.delete('/consuming/subscription', async (req, reply) => {
    try {
        // @ts-ignore
        const { userId, eventId } = req.body;
        const config = {
            ...authHeader(),
            data: {
                userId,
                eventId
            }
        };
        const { data } = await axios.delete('http://localhost:3333/subscription', config);
        reply.send(data);
    } catch (error) {
        // @ts-ignore
        errorHandler(reply, error.response.data);
    }
});

app.post('/consuming/checkin', async (req, reply) => {
    try {
        // @ts-ignore
        const {userId, eventId} = req.body;
        const {data} = await axios.post('http://localhost:3333/checkin', {userId, eventId}, authHeader());
        reply.send(data);
    } catch (error) {
        // @ts-ignore
        errorHandler(reply, error.response.data);
    }
});


app.listen({port: 5555, host: '0.0.0.0'}).then(() => {
    console.log('Server para consumir subscriptions de Events Full - running!')
});
