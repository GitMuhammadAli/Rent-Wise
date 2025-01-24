import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Card, CardBody, Flex } from '@chakra-ui/react';

const receivedReviews = [
  {
    id: '1',
    reviewerName: 'Alice Johnson',
    reviewerAvatar: '/placeholder.svg',
    rating: 5,
    comment: 'Great experience! The item was in perfect condition.',
    date: '2023-05-24',
  },
  {
    id: '2',
    reviewerName: 'Bob Smith',
    reviewerAvatar: '/placeholder.svg',
    rating: 4,
    comment: 'Good rental, but could use some minor improvements.',
    date: '2023-06-15',
  },
];

const potentialReviews = [
  {
    id: '1',
    ownerId: 'owner456',
    ownerName: 'John Doe',
    ownerAvatar: '/placeholder.svg',
    listingId: 'listing123',
    listingTitle: 'Luxury Sedan',
    rentalDate: '2023-07-01',
    images: ['/placeholder.svg', '/placeholder.svg'],
  },
  {
    id: '2',
    ownerId: 'owner789',
    ownerName: 'Jane Smith',
    ownerAvatar: '/placeholder.svg',
    listingId: 'listing456',
    listingTitle: 'Beachfront Villa',
    rentalDate: '2023-07-15',
    images: ['/placeholder.svg', '/placeholder.svg'],
  },
];

const StarRating = ({ rating }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

export default function ReviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reviews</h1>
      <Tabs variant="enclosed">
        <TabList mb="4">
          <Tab>Reviews You've Received</Tab>
          <Tab>People You Can Review</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card>
              <CardBody>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reviews You've Received</h2>
                <div className="space-y-6">
                  {receivedReviews.map((review) => (
                    <div key={review.id} className="flex items-start space-x-4">
                      <img
                        src={review.reviewerAvatar || '/placeholder.svg'}
                        alt={review.reviewerName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{review.reviewerName}</h3>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <CardBody>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">People You Can Review</h2>
                <div className="space-y-6">
                  {potentialReviews.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row md:items-start md:space-x-4">
                      <div className="flex-shrink-0 mb-4 md:mb-0">
                        <img
                          src={item.images[0] || '/placeholder.svg'}
                          alt={item.listingTitle}
                          width={120}
                          height={80}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{item.listingTitle}</h3>
                          <span className="text-sm text-gray-500">Rented on: {item.rentalDate}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <img
                            src={item.ownerAvatar || '/placeholder.svg'}
                            alt={item.ownerName}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-sm text-gray-600">{item.ownerName}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.images.slice(1).map((image, index) => (
                            <img
                              key={index}
                              src={image || '/placeholder.svg'}
                              alt={`${item.listingTitle} image ${index + 2}`}
                              width={80}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Link to={`/listing/${item.listingId}`} className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center">
                            View Listing
                            <FaExternalLinkAlt className="ml-1 w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
