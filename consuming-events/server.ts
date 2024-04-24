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

app.get('/consuming/events', async (_, reply) => {
    try {
        const { data } = await axios.get('http://localhost:3333/events', authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao consumir o endpoint de eventos');
    }
});

app.get('/consuming/events/:eventId', async (req, reply) => {
    try {
        // @ts-ignore
        const eventId = req.params.eventId;
        const { data } = await axios.get(`http://localhost:3333/events/${eventId}`, authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao deletar evento');
    }
});

app.post('/consuming/events', async (req, reply) => {
    try {
        // @ts-ignore
        const { title, details, maximumAttendees, dateTime } = req.body;
        const { data } = await axios.post('http://localhost:3333/events', { title, details, maximumAttendees, dateTime }, authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao criar evento');
    }
});

app.put('/consuming/events', async (req, reply) => {
    try {
        // @ts-ignore
        const { title, details, maximumAttendees, dateTime } = req.body;
        const { data } = await axios.put('http://localhost:3333/events', { title, details, maximumAttendees, dateTime }, authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao editar evento');
    }
});

app.delete('/consuming/events/:eventId', async (req, reply) => {
    try {
        // @ts-ignore
        const eventId = req.params.eventId;
        const { data } = await axios.delete(`http://localhost:3333/events/${eventId}`, authHeader());
        reply.send(data);
    } catch (error) {
        errorHandler(reply, 'Erro ao deletar evento');
    }
});

app.listen({ port: 5555, host: '0.0.0.0' }).then(() => {
    console.log('Server para consumir Events Full - running!')
});
