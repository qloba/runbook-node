"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getArticle_js_1 = __importDefault(require("./queries/getArticle.js"));
const getArticles_js_1 = __importDefault(require("./queries/getArticles.js"));
const getBooks_js_1 = __importDefault(require("./queries/getBooks.js"));
const getCategories_js_1 = __importDefault(require("./queries/getCategories.js"));
const search_js_1 = __importDefault(require("./queries/search.js"));
const queries = {
    getArticle: getArticle_js_1.default,
    getArticles: getArticles_js_1.default,
    getBooks: getBooks_js_1.default,
    getCategories: getCategories_js_1.default,
    search: search_js_1.default
};
class runbook {
    baseUrl;
    apiToken;
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.apiToken = config.apiToken;
    }
    async postData(data) {
        try {
            const response = await fetch(this.getEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiToken}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            return JSON.stringify(result);
        }
        catch (error) {
            console.error('Error posting data:', error);
        }
    }
    getEndpoint() {
        return `${this.baseUrl}/api/graphql`;
    }
    async query(name, variables) {
        if (!(name in queries)) {
            throw new Error(`Query ${name} not found`);
        }
        const data = {
            query: queries[name],
            variables
        };
        return await this.postData(data);
    }
}
exports.default = runbook;
