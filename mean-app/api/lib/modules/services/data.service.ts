import {IPost, Query} from "../models/data.model";
import PostModel from '../schemas/data.schema';
import mongoose from "mongoose";

class DataService {
    public async createPost(postParams: IPost) {
        try {
            const dataModel = new PostModel(postParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            const result = await PostModel.find(query, { __v: 0/*, _id: 0*/ });
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async getById(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid ID format');
            }
            const post = await PostModel.findById(id, { __v: 0 });
            if (!post) {
                throw new Error('Post not found');
            }
            return post;
        } catch (error) {
            console.error('Error fetching post by ID:', error);
            throw new Error(`Error fetching post by ID: ${error.message}`);
        }
    }

    public async deleteById(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid ID format');
            }
            const deletedPost = await PostModel.findByIdAndDelete(id);
            if (!deletedPost) {
                throw new Error('Post not found');
            }
            return deletedPost;
        } catch (error) {
            console.error('Error deleting post by ID:', error);
            throw new Error(`Error deleting post by ID: ${error.message}`);
        }
    }

    public async deleteAllPosts() {
        try {
            const result = await PostModel.deleteMany({});
            return result;
        } catch (error) {
            console.error('Error deleting all posts:', error);
            throw new Error(`Error deleting all posts: ${error.message}`);
        }
    }
}

export default DataService;