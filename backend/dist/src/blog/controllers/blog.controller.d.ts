import { BlogService } from '../services/blog.service';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findAll(): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string;
        author: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string;
        author: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
