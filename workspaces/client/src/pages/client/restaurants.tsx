import { gql } from '@apollo/client';
import React from 'react';


const RESTAURANTS_QUERY = gql`
    query restaurantsPageQuery {
        allCategories {
            ok
            error
            categories {
                id
                name
                coverImg
                slug
                restaurantCount
            }
        }
        restaurants {
            ok
            error
            totalPages
            totalResults
            results {
                id
                name
                coverImg
                category
                address
                isPromoted
            }
        }
    }
`


export const Restaurant = () => {

    return (
        <h1>ddfdsdffdsfds</h1>
    )
}