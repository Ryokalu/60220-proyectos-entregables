import { Router } from 'express';
//import del service para Students. (Se puede probar con el service del file system o el de mongoose)
// import StudentService from '../services/filesystem/students.service.js';
import StudentService from '../services/db/students.service.js';

const router = Router();
const studentService = new StudentService();

router.get('/', async (req, res) => {
    try {
        let students = await studentService.getAll();
        res.send(students);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los estudiantes." });
    }

})

router.post('/', async (req, res) => {
    try {
        let result = await studentService.save(req.body);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo guardar el estudiante." });
    }
})

router.get('/:username', async (req, res) => {
    let { username } = req.params
    try {
        let student = await studentService.findByUsername(username);
        if (!student) {
            res.status(404).send({ message: "Estudiante no encontrado" })
            throw new Error("Estudiante no encontrado")
        } else {
            res.send(student);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener el estudiante por su username." });
    }
})

export default router;