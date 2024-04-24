import fastify, { FastifyReply } from "fastify";
import axios from "axios";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

const authHeader = () => ({
    headers: {
        Authorization: `Basic ${Buffer.from('Tyrion:wine').toString('base64')}`
    }
});

const errorHandler = (reply: FastifyReply, errorMessage: string) => {
    reply.status(500).send({ error: errorMessage });
};

app.get('/consuming/subscriptions/:userId', async (req, reply) => {
    try {
        // @ts-ignore
        const userId = req.params.userId;
        const { data } = await axios.get(`http://localhost:3333/subscriptions/${userId}`, authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao consumir o endpoint /consuming/subscriptions/:userId');
    }
});

app.listen({ port: 5555, host: '0.0.0.0' }).then(() => {
    console.log('Server para consumir subscriptions de Events Full - running!')
});
