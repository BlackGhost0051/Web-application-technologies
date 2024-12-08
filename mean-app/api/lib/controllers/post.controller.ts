import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import {checkPostCount} from "../middlewares/checkPostCount.middleware";
import DataService from '../modules/services/data.service';
import {Query} from "../modules/models/data.model";
import mongoose from "mongoose";
import logRequest from "../middlewares/logRequest.middleware";
import Joi from "joi";

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class PostController implements Controller {
    public path = '/api/post';
    public router = Router();
    private dataService = new DataService();

    constructor() {
        this.router.use(logRequest);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getElementById);
        this.router.get(`${this.path}Id/:id`, this.getElementByIdMy); // My
        this.router.get(`${this.path}/:num`, this.getNElements);
        this.router.get(`${this.path}s`, this.getAll);

        this.router.post(this.path, this.addData);
        //this.router.post(`${this.path}/:id`, this.addData);
        this.router.post(`${this.path}/:num`, checkPostCount, this.addData);
        //this.router.post(`${this.path}/:num`, checkPostCount, this.getPostByNum);

        //this.router.delete(`${this.path}/:id`, this.deleteById);
        this.router.delete(`${this.path}/:id`, this.removePost);
        this.router.delete(`${this.path}Id/:id`, this.deleteElementById); // My
        this.router.delete(`${this.path}s`, this.deleteAll); // My

    }

    /*
    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json(testArr);
    };
    */

    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query as Query<string | number | boolean>;
            const data = await this.dataService.query(query);
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            next(error);
        }
    };



    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const {title, text, image} = request.body;

        const schema = Joi.object({
            title: Joi.string().required(),
            text: Joi.string().required(),
            image: Joi.string().uri().required()
        });

        try {
            const validateData = await schema.validateAsync({title, text, image})
            await this.dataService.createPost(validateData);
            response.status(200).json(validateData);
        } catch (error) {
            console.log('eeee', error)

            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Invalid input data.'});
        }
    }

    private getElementById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ error: 'Invalid ID format' });
        }

        const allData = await this.dataService.query({_id: id});
        console.log("allData = ", allData);
        response.status(200).json(allData);
    }

    private getElementByIdMy = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const post = await this.dataService.getById(id);
            response.status(200).json(post);
        } catch (error) {
            console.error('Error fetching post by ID:', error);
            response.status(500).json({ message: 'Error fetching post by ID', error: error.message });
        }
    };


    private removePost = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        await this.dataService.deleteData({_id: id});
        response.sendStatus(200);
    };

    /*
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
    */

    private deleteElementById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const deletedPost = await this.dataService.deleteById(id);
            response.status(200).json(deletedPost);
        } catch (error) {
            console.error('Error deleting post by ID:', error);
            response.status(500).json({ message: 'Error deleting post by ID', error: error.message });
        }
    };


    /*private deleteAll = (req: Request, res: Response, next: NextFunction) => {
        testArr = [];
        res.status(200).json({
            message: 'All elements deleted',
            updatedArray: testArr,
        });
    };*/

    private deleteAll = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await this.dataService.deleteAllPosts();
            response.status(200).json(result);
        } catch (error) {
            console.error('Error deleting all posts:', error);
            response.status(500).json({ message: 'Error deleting all posts', error: error.message });
        }
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