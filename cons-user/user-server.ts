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

app.get('/consuming/users', async (_, reply) => {
    try {
        const { data } = await axios.get('http://localhost:3333/users', authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao consumir o endpoint de usuários');
    }
});

app.post('/consuming/users', async (req, reply) => {
    try {
        // @ts-ignore
        const { name, email, password } = req.body;
        const { data } = await axios.post('http://localhost:3333/users', { name, email, password }, authHeader());
        reply.send(data);
    } catch (error) {
        // @ts-ignore
        errorHandler(reply, error.response.data);
    }
});

app.put('/consuming/users', async (req, reply) => {
    try {
        // @ts-ignore
        const { name, email, password } = req.body;
        const { data } = await axios.put('http://localhost:3333/users', { name, email, password }, authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao editar usuário');
    }
});

app.delete('/consuming/users/:userId', async (req, reply) => {
    try {
        // @ts-ignore
        const userId = req.params.userId;
        const { data } = await axios.delete(`http://localhost:3333/users/${userId}`, authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao deletar usuário');
    }
});

app.post('/consuming/login', async (req, reply) => {
    try {
        // @ts-ignore
        const { email, password } = req.body;
        const { data } = await axios.post('http://localhost:3333/login', { email, password }, authHeader());
        reply.send(data);
    } catch (error) {
        // @ts-ignore
        errorHandler(reply, error.response.data);
    }
});

app.listen({ port: 5555, host: '0.0.0.0' }).then(() => {
    console.log('Server para consumir Events Full - running!')
});