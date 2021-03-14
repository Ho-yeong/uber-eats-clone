import { ApolloProvider } from '@apollo/client';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { createMockClient } from 'mock-apollo-client';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Login } from '../login'
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('<Login />', () => {

    let renderResult: RenderResult ;

    beforeEach(async () => {
        await waitFor(async () => {
            const mockClient = createMockClient();

            renderResult = render(
                <HelmetProvider>
                    <Router>
                        <ApolloProvider client={mockClient}>
                            <Login />
                        </ApolloProvider>
                    </Router>
                </HelmetProvider>
            );
            
        });
    })

    it("should render OK", async () => {
      await waitFor(() => {
          expect(document.title).toBe('Login | Uber eats');
      })  
    })

    it('displays email validation errors', async () => {
        const { getByPlaceholderText, getByRole, debug } = renderResult;
        const email = getByPlaceholderText('Email');
        await waitFor(() => {
            userEvent.type(email, "test@")
        });
        let errorMessage = getByRole('alert')
        expect(errorMessage).toHaveTextContent(/Please enter a valid email/i)
        await waitFor(() => {
            userEvent.clear(email)
        })
        debug();
    });

})