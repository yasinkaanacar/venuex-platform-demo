export interface RouteConfig {
    title: string;
    breadcrumbs: { label: string; href?: string }[];
}

export const routes: Record<string, RouteConfig> = {
    // Dashboard
    '/': {
        title: 'Overview',
        breadcrumbs: [{ label: 'VenueX', href: '/' }]
    },

    // Location Management
    '/locations': {
        title: 'Locations',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Locations', href: '/locations' }
        ]
    },
    '/locations2': {
        title: 'Locations',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Locations', href: '/locations2' }
        ]
    },
    '/location-match': {
        title: 'Location Match',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Locations', href: '/locations' },
            { label: 'Match', href: '/location-match' }
        ]
    },

    // Sales & Conversions
    '/offline-conversions': {
        title: 'Offline Conversions',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Offline Conversions', href: '/offline-conversions' }
        ]
    },
    '/offline-conversionsMVP': {
        title: 'Offline Conversions (MVP)',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Offline Conversions', href: '/offline-conversionsMVP' }
        ]
    },
    '/catalog': {
        title: 'Local Inventory',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Local Inventory', href: '/catalog' }
        ]
    },
    '/segments': {
        title: 'Segments',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Segments', href: '/segments' }
        ]
    },
    '/segmentsMVP': {
        title: 'Segments MVP',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Segments', href: '/segmentsMVP' }
        ]
    },

    // Reviews & Reputation
    '/reviews': {
        title: 'Reviews',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Reviews', href: '/reviews' }
        ]
    },
    '/reviewsX': {
        title: 'Reviews X',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Reviews', href: '/reviewsX' }
        ]
    },
    '/reviewsMVP': {
        title: 'Reviews MVP',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Reviews', href: '/reviewsMVP' }
        ]
    },

    // AI & Insights
    '/venuex-ai': {
        title: 'VenueX AI',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'AI Assistant', href: '/venuex-ai' }
        ]
    },
    '/ai-recommendations': {
        title: 'AI Recommendations',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Recommendations', href: '/ai-recommendations' }
        ]
    },

    // Content & Posts
    '/create-post': {
        title: 'Create Post',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Posts', href: '/create-post' }
        ]
    },
    '/manage-posts': {
        title: 'Manage Posts',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Posts', href: '/manage-posts' },
            { label: 'Manage', href: '/manage-posts' }
        ]
    },

    // Setup & Admin
    '/setup': {
        title: 'Setup',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Setup', href: '/setup' }
        ]
    },
    '/setup2': {
        title: 'Setup',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Setup', href: '/setup2' }
        ]
    },
    '/components': {
        title: 'Components',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Dev', href: '/components' }
        ]
    },
    '/settings': {
        title: 'Settings',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Ayarlar', href: '/settings' }
        ]
    },
    '/profile': {
        title: 'Profile',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Profile', href: '/profile' }
        ]
    },

    // Location Forms
    '/locations/add': {
        title: 'Konum Ekle',
        breadcrumbs: [
            { label: 'VenueX', href: '/' },
            { label: 'Lokasyonlar', href: '/locations' },
            { label: 'Konum Ekle' }
        ]
    }
};

export function getRouteConfig(path: string): RouteConfig {
    // Exact match
    if (routes[path]) {
        return routes[path];
    }

    // Dynamic route: /locations/:id/edit
    if (path.startsWith('/locations/') && path.endsWith('/edit')) {
        return {
            title: 'Konumu Düzenle',
            breadcrumbs: [
                { label: 'VenueX', href: '/' },
                { label: 'Lokasyonlar', href: '/locations' },
                { label: 'Konumu Düzenle' }
            ]
        };
    }

    // Default fallback
    return {
        title: 'VenueX',
        breadcrumbs: [{ label: 'VenueX', href: '/' }]
    };
}
