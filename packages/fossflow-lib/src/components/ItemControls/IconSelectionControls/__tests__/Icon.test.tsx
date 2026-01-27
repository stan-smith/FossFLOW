import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Icon } from '../Icon';
import { Icon as IconI } from 'src/types';

describe('Icon', () => {
    const flatIcon: IconI = {
        id: 'flaticon',
        name: 'flat icon',
        url: 'src/assets/grid-tile-bg.svg',
        isIsometric: false
    }

    const isometricIcon: IconI = {
        id: 'isoicon',
        name: 'isometric icon',
        url: 'src/assets/grid-tile-bg.svg',
        isIsometric: true
    }

    it("should show 'flat' label for non isometric icon", () => {
        render(
            <Icon icon={flatIcon} />
        )
        const label = screen.getByText('flat')
        expect(label).toBeInTheDocument()
    })

    it("should not show 'flat' label for isometric icon", () => {
        render(
            <Icon icon={isometricIcon} />
        )
        expect(screen.queryByText('flat')).toBeNull()
    })
})