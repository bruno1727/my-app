import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Square from '../square';

test('loads button and displays value', () => {
    render(<Square value="epaa" />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('epaa');
});