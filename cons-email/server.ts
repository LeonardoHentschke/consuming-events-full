import fastify, { FastifyReply } from "fastify";
import axios from "axios";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();

// Function to generate authorization header
const authHeader = () => ({
    headers: {
        Authorization: `Basic ${Buffer.from('Tyrion:wine').toString('base64')}`
    }
});

// Error handler function
const errorHandler = (reply: FastifyReply, errorMessage: string) => {
    reply.status(500).send({ error: errorMessage });
};

app.post('/consuming/email', async (req, reply) => {
    try {
        // @ts-ignore
        const { to, title, content } = req.body;
        const { data } = await axios.post('http://localhost:3333/email', { to, title, content }, authHeader());
        reply.send(data);
    } catch (error) {
        // @ts-ignore
        errorHandler(reply, error.response.data);
    }
});

app.listen({ port: 5555, host: '0.0.0.0' }).then(() => {
    console.log('Server para consumir Events Full - running!')
});