/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// add domains we commonly fetch plant images from (Perenual, Wikimedia, Flickr)
		domains: [
			'perenual.com',
			'upload.wikimedia.org',
			'live.staticflickr.com',
			'images.unsplash.com',
			'eypnrfshqyszmdjqozbu.supabase.co'
		]
	}
};

export default nextConfig;
