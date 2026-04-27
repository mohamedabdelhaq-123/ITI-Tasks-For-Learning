
// we need to query the graphql to:
// 1. fetch the articles including their comments and including the articles' author
// 2. fetch article by its id

// Add mutation to create Article
const authors = [
  { id: "1", fullname: "Mohamed Abdelhaq", email: "mo@example.com", dob: "1995-01-01" },
  { id: "2", fullname: "Jane Smith", email: "jane@example.com", dob: "1988-05-12" },
  { id: "3", fullname: "Ahmed Ali", email: "ahmed@example.com", dob: "1992-11-20" }
];

const articles = [
  { id: "101", title: "Intro to GraphQL", content: "GraphQL is awesome...", authorId: "1" },
  { id: "102", title: "Node.js Tips", content: "Nodemon is a life saver...", authorId: "2" },
  { id: "103", title: "Web Services Lab", content: "Learning Apollo Server...", authorId: "1" }
];

const comments = [
  { id: "501", title: "Good Job", content: "Helpful article!", articleId: "101", authorId: "2" },
  { id: "502", title: "Question", content: "How do I install pnpm?", articleId: "101", authorId: "3" },
  { id: "503", title: "Nice", content: "I like the examples.", articleId: "102", authorId: "1" }
];

const resolvers = {

    Query: {

        article: (parent,args,context,info)=>{
            return articles.find(article => article.id === args.id);
        },
        articles: (parent,args,context,info) => articles,
        author: (parent,args,context,info) => authors.find(author => author.id === args.id),   
        authors: (parent,args,context,info) => authors,
        comments: (parent,args,context,info) => comments,
        comment: (parent,args,context,info) => comments.find(comment => comment.id === args.id)

    },

    Article: {
        author: (parent,args,context,info)=> authors.find(author=> (parent.authorId=== author.id)),
        comments: (parent,args,context,info)=> comments.filter(comm=>(parent.id===comm.articleId))
    },

    Mutation: {
        createAuthor: (parent,args,context,info) => {
            const newAuthor = {
                id: String(authors.length + 1),
                fullname: args.fullname,
                email: args.email,
                dob: args.dob
            };
            authors.push(newAuthor);
            return newAuthor;
        },
        createArticle: (parent,args,context,info) => {
            const newArticle = {
                id: String(articles.length + 101),
                title: args.title,
                content: args.content,
                authorId: args.authorId
            };
            articles.push(newArticle);
            return newArticle;
        },
        createComment: (parent,args,context,info) => {
            const newComment = {
                id: String(comments.length + 501),
                title: args.title,
                content: args.content,
                articleId: args.articleId,
                authorId: args.authorId
            };
            comments.push(newComment);
            return newComment;
        }   
    }

};

module.exports = resolvers;