import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const namesFilePath = path.join(__dirname, '../data/names.json');
const namesSeedFilePath = path.join(__dirname, '../data/namesSeed.json');

const getNames = (): string[] => {
    const data = fs.readFileSync(namesFilePath, 'utf-8'); // Lee el archivo names.json
    return JSON.parse(data); // Devuelve los nombres como un array
};

const saveNames = (names: string[]): void => {
    fs.writeFileSync(namesFilePath, JSON.stringify(names, null, 2)); // Guarda los nombres en names.json
};

const getRandomName = (): string => {
    const data = fs.readFileSync(namesSeedFilePath, 'utf-8'); // Lee el archivo namesSeed.json
    const { firstNames, lastNames } = JSON.parse(data); // Extrae los nombres y apellidos
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]; // Selecciona un nombre aleatorio
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]; // Selecciona un apellido aleatorio
    return `${firstName} ${lastName}`; // Devuelve el nombre completo
};

router.get('/', (req: Request, res: Response) => {
    const names = getNames(); // Obtiene los nombres
    res.render('index', { names }); // Renderiza la vista 'index' con los nombres
});

router.get('/form', (req: Request, res: Response) => {
    res.render('form'); // Renderiza la vista 'form'
});

router.post('/add-name', (req: Request, res: Response) => {
    const { name } = req.body; // Obtiene el nombre del cuerpo de la solicitud
    const names = getNames(); // Obtiene los nombres
    names.push(name); // Agrega el nuevo nombre
    saveNames(names); // Guarda los nombres actualizados
    res.redirect('/'); // Redirige a la página principal
});

router.post('/generate-names', (req: Request, res: Response) => {
    const { count } = req.body; // Obtiene la cantidad de nombres a generar
    const names = getNames(); // Obtiene los nombres actuales
    for (let i = 0; i < count; i++) {
        names.push(getRandomName()); // Genera y agrega nombres aleatorios
    }
    saveNames(names); // Guarda los nombres actualizados en el archivo names.json
    res.redirect('/'); // Redirige a la página principal
});

router.post('/delete-generated-names', (req: Request, res: Response) => {
    const names = getNames(); // Obtiene los nombres
    const data = fs.readFileSync(namesSeedFilePath, 'utf-8'); // Lee el archivo namesSeed.json
    const { firstNames, lastNames } = JSON.parse(data); // Extrae los nombres y apellidos
    const generatedNames = firstNames.flatMap((firstName: string) => lastNames.map((lastName: string) => `${firstName} ${lastName}`)); // Genera todos los nombres posibles
    const filteredNames = names.filter(name => !generatedNames.includes(name)); // Filtra los nombres generados
    saveNames(filteredNames); // Guarda los nombres actualizados
    res.redirect('/'); // Redirige a la página principal
});

router.post('/delete-name', (req: Request, res: Response) => {
    const { name } = req.body; // Obtiene el nombre del cuerpo de la solicitud
    let names = getNames(); // Obtiene los nombres
    names = names.filter(n => n !== name); // Filtra el nombre a eliminar
    saveNames(names); // Guarda los nombres actualizados
    res.redirect('/'); // Redirige a la página principal
});

export default router;