import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';


let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class PostController implements Controller {
    public path = '/api/post';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getElementById);
        this.router.get(`${this.path}/:num`, this.getNElements);
        this.router.get(`${this.path}s`, this.getAll);

        this.router.post(this.path, this.addData);
        this.router.post(`${this.path}/:id`, this.addData);

        this.router.delete(`${this.path}/:id`, this.deleteById);
        this.router.delete(`${this.path}s`, this.deleteAll);

    }

    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json(testArr);
    };

    private addData = (req: Request, res: Response, next: NextFunction) => {
        const value = Number(req.body.elem);

        if (!isNaN(value)) {
            testArr.push(value);
            res.status(201).json({
                message: 'Value added',
                newValue: value,
                updatedArray: testArr,
            });
        } else {
            res.status(400).json({
                message: 'Bad data type. Must be a number!',
            });
        }
    };

    private getElementById = (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);

        if (!isNaN(id) && id >= 0 && id < testArr.length) {
            res.status(200).json({ value: testArr[id] });
        } else {
            res.status(404).json({ message: 'Element not found!' });
        }
    };

    private deleteById = (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);

        if (!isNaN(id) && id >= 0 && id < testArr.length) {
            const deletedValue = testArr.splice(id, 1);
            res.status(200).json({
                message: 'Value deleted',
                deletedValue: deletedValue[0],
                updatedArray: testArr,
            });
        } else {
            res.status(404).json({ message: 'Element not found!' });
        }
    };

    private deleteAll = (req: Request, res: Response, next: NextFunction) => {
        testArr = [];
        res.status(200).json({
            message: 'All elements deleted',
            updatedArray: testArr,
        });
    };

    private getNElements = (req: Request, res: Response, next: NextFunction) => {
        const num = Number(req.params.num);

        if (!isNaN(num) && num > 0) {
            const elements = testArr.slice(0, num);
            res.status(200).json({
                message: `${num} elements retrieved`,
                elements,
            });
        } else {
            res.status(400).json({
                message: 'Invalid number! Must be greater than 0.',
            });
        }
    };

}

export default PostController;