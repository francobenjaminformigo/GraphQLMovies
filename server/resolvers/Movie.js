const Movie = require("../models/Movie");

const Query = {
    movies: async (_, args) => {
        try{
            let filter = {...args};
            if(args.title){
                filter = {
                    ...filter,
                    title: {$regex: args.title, $options:"i"},
                }
            }
            const movies = await Movie.find(filter).populate("genre");
            return movies;
        }catch(err){
            throw new Error(err);
        }
    },
    movieById: async (_, { id }) => {
        try{
            const movie = await Movie.findById(id).populate("genre");
            if(movie){
                return movie;
            }else{
                throw new Error("Movie not found");
            }
        }catch(err){
            throw new Error(err);
        }
    }
};

const Mutation = {
    createMovie: async (_, {input}) => {
        try{
            const newMovie = new Movie(input);
            const movie = await newMovie.save();
            const populatedMovie = await Movie.populate(movie, {path: "genre"});
            return populatedMovie;
        }catch(err){
            throw new Error(err);
        }
    },
    updateMovie: async (_, { id, input }, context) => {
        try {
            const updateMovie = await Movie.findByIdAndUpdate(
                id,
                { $set: input },
                { new: true },
            ).populate("genre");
            return updateMovie;
        }catch(err){
            throw new Error(err);
        }
    },
    deleteMovie: async (_, { id }) => {
        try{
            const deleteMovie = await Movie.findByIdAndDelete(id);
            return "Movie deleted successfully";
        }catch(err){
            throw new Error(err);
        }
    },
};

module.exports = {
    Query,
    Mutation,
};