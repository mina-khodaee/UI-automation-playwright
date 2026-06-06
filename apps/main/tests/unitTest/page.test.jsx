import { test, expect } from '@playwright/test';
import { render, screen } from '@testing-library/react'
import { TestComponent } from 'src/components/test/test-component'


test('TestComponent',  () => {
    render(<TestComponent />)
    expect(screen.getByText('Testing Unit Test')).toBeDefined()
});