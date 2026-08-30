import type { HelpTopic, RequestStatus, SupportRequest } from '@/types/support'

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'account-profile',
    icon: 'person',
    title: 'Account and Profile',
    description: 'Manage your profile, password, privacy settings and account information.',
    faqs: [
      {
        id: 'account-profile-1',
        question: 'How do I update my account information?',
        answer: 'Go to Settings → Profile to update your name, photo, and bio.',
      },
      {
        id: 'account-profile-2',
        question: 'How can I reset my password?',
        answer: 'Go to Settings → Security → Change Password and follow the prompts.',
      },
      {
        id: 'account-profile-3',
        question: 'Where can I change my privacy settings?',
        answer: 'Go to Settings → Privacy to control who can see your profile and posts.',
      },
      {
        id: 'account-profile-4',
        question: 'How do I delete my account?',
        answer: 'Go to Settings → Delete Account. This permanently removes your data.',
      },
    ],
  },
  {
    id: 'membership-billing',
    icon: 'creditcard',
    title: 'Membership & Billing',
    description: 'Manage your subscription, payments, billing information and receipts.',
    faqs: [
      {
        id: 'membership-billing-1',
        question: 'Why was my payment declined?',
        answer:
          'This can happen if your card has expired or your bank blocked the charge. Update your payment method in Settings → Subscription.',
      },
      {
        id: 'membership-billing-2',
        question: 'Can I update my billing information after a declined payment?',
        answer: 'Yes, go to Settings → Billing to update your card details at any time.',
      },
      {
        id: 'membership-billing-3',
        question: 'How do I retry a declined payment?',
        answer: 'Go to Settings → Subscription and tap Retry Payment once your card details are updated.',
      },
      {
        id: 'membership-billing-4',
        question: 'How do I cancel my subscription?',
        answer: 'Go to Settings → Subscription → Cancel Subscription.',
      },
    ],
  },
  {
    id: 'messages-connections',
    icon: 'envelope',
    title: 'Messages & Connections',
    description: 'Get help with messages, message requests, connections, blocking and reporting members.',
    faqs: [
      {
        id: 'messages-connections-1',
        question: 'How do I send someone a message?',
        answer:
          "Open the member's profile and select Message, or go to Messages → New Message and search for the member.",
      },
      {
        id: 'messages-connections-2',
        question: 'Can I send photos or files?',
        answer: 'Yes, tap the photo icon in the message composer to attach an image.',
      },
      {
        id: 'messages-connections-3',
        question: 'How do I delete a conversation?',
        answer: 'Swipe left on a conversation in your Messages list and tap Delete.',
      },
      {
        id: 'messages-connections-4',
        question: 'How do I block someone?',
        answer: "Open the member's profile, tap the menu icon, and select Block.",
      },
    ],
  },
  {
    id: 'learning-hub',
    icon: 'book',
    title: 'Learning Hub',
    description: 'Get help accessing courses, tracking your progress and downloading certificates.',
    faqs: [
      {
        id: 'learning-hub-1',
        question: 'How do I find courses?',
        answer: 'Go to Learn and browse available courses, lessons, and learning resources.',
      },
      {
        id: 'learning-hub-2',
        question: 'How do I enroll in a course?',
        answer: 'Open a course and tap Enroll to add it to your learning list.',
      },
      {
        id: 'learning-hub-3',
        question: 'Where can I see my courses?',
        answer: 'Go to Learn → My Courses to see everything you have enrolled in.',
      },
      {
        id: 'learning-hub-4',
        question: 'Is my learning progress saved automatically?',
        answer: 'Yes, your progress is saved automatically as you complete lessons.',
      },
    ],
  },
  {
    id: 'events-hangouts',
    icon: 'calendar',
    title: 'Events & Hangouts',
    description: 'Find information about registration, event access, cancellations and recordings.',
    faqs: [
      {
        id: 'events-hangouts-1',
        question: 'How do I find upcoming events?',
        answer: 'Go to Events to browse upcoming virtual and in-person experiences.',
      },
      {
        id: 'events-hangouts-2',
        question: 'How do I register for an event?',
        answer: 'Open an event and tap RSVP to reserve your spot.',
      },
      {
        id: 'events-hangouts-3',
        question: "Where can I find events I've registered for?",
        answer: 'Go to Events → My Events to see everything you have RSVP’d to.',
      },
      {
        id: 'events-hangouts-4',
        question: 'How do I join a virtual event?',
        answer: 'Open the event from My Events and tap Join when it goes live.',
      },
    ],
  },
  {
    id: 'privacy-security',
    icon: 'lock',
    title: 'Privacy & Security',
    description: 'Manage your password, account security, personal data and privacy.',
    faqs: [
      {
        id: 'privacy-security-1',
        question: 'How do I turn on two-factor authentication?',
        answer: 'Go to Settings → Security → Two-Factor Authentication and follow the prompts.',
      },
      {
        id: 'privacy-security-2',
        question: 'Who can see my profile and posts?',
        answer: 'Go to Settings → Privacy to choose who can view your profile and posts.',
      },
      {
        id: 'privacy-security-3',
        question: 'How do I report a security concern?',
        answer: 'Contact our support team directly and we will investigate right away.',
      },
      {
        id: 'privacy-security-4',
        question: 'How is my personal data stored?',
        answer: 'Go to Settings → Data to review and download the data we store about you.',
      },
    ],
  },
  {
    id: 'community-circles',
    icon: 'person.2',
    title: 'Community & Private Circles',
    description: 'Learn about posting, commenting, joining circles and managing your community experience.',
    faqs: [
      {
        id: 'community-circles-1',
        question: 'How do I join a Circle?',
        answer: 'Browse Private Circles from the menu and request to join one that fits you.',
      },
      {
        id: 'community-circles-2',
        question: 'Can I leave a Circle after joining?',
        answer: 'Yes, open the Circle, tap the menu icon, and select Leave Circle.',
      },
      {
        id: 'community-circles-3',
        question: 'How do I report a member or post?',
        answer: 'Tap the menu icon on the post or profile and select Report.',
      },
      {
        id: 'community-circles-4',
        question: 'Who can see what I post in a Circle?',
        answer: 'Only members of that Circle can see what you post inside it.',
      },
    ],
  },
]

export const SUPPORT_CATEGORIES = HELP_TOPICS.map(topic => topic.title)

export const STATUS_META: Record<RequestStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'info' }> = {
  resolved: { label: 'Resolved', tone: 'success' },
  in_progress: { label: 'In Progress', tone: 'warning' },
  not_resolved: { label: 'Not Resolved', tone: 'danger' },
  requires_action: { label: 'Requires action', tone: 'info' },
}

export const SUPPORT_REQUESTS: SupportRequest[] = [
  {
    id: 'DNG-13456',
    category: 'Membership & Billing',
    subject: 'Premium membership not showing',
    message: "I paid for the premium membership but it hasn't reflected yet. How can I resolve this?",
    status: 'resolved',
    submittedAt: 'Aug 1, 09:25 PM',
    updatedLabel: 'Updated 2 hrs ago',
    messages: [
      {
        id: 'DNG-13456-m1',
        fromSupport: false,
        content: "I paid for the premium membership but it hasn't reflected yet. How can I resolve this?",
        time: '9:25 PM',
      },
      {
        id: 'DNG-13456-m2',
        fromSupport: true,
        content:
          'Hello Amara 👋, thank you for reaching out, our team has received your request (#DNG-13456) and we are looking into it.',
        time: '9:31 PM',
      },
      {
        id: 'DNG-13456-m3',
        fromSupport: true,
        content: "Good news — your premium membership is now active. Please restart the app to see the change.",
        time: '11:02 PM',
      },
    ],
  },
  {
    id: 'DNG-13457',
    category: 'Account and Profile',
    subject: 'App crashes on startup',
    message: 'The app closes immediately after opening on my Android device.',
    status: 'in_progress',
    submittedAt: 'Aug 1, 11:25 AM',
    updatedLabel: 'Reported 30 mins ago',
    messages: [
      {
        id: 'DNG-13457-m1',
        fromSupport: false,
        content: 'App crashes on startup. The app closes immediately after opening on my Android device.',
        time: '11:25',
      },
      {
        id: 'DNG-13457-m2',
        fromSupport: true,
        content:
          'Hello Amara 👋, thank you for reaching out, our team has received your request (#DNG-13457) and we are looking into it.',
        time: '11:25',
      },
      {
        id: 'DNG-13457-m3',
        fromSupport: false,
        content: 'Hello, thank you, im looking forward to your response.',
        time: '11:25',
      },
    ],
  },
  {
    id: 'DNG-13458',
    category: 'Account and Profile',
    subject: 'Unable to upload profile picture',
    message: 'When I try to upload my profile image, it gives an error message.',
    status: 'not_resolved',
    submittedAt: 'Jul 31, 04:10 PM',
    updatedLabel: 'Waiting on user response',
    messages: [
      {
        id: 'DNG-13458-m1',
        fromSupport: false,
        content: 'When I try to upload my profile image, it gives an error message.',
        time: '4:10 PM',
      },
      {
        id: 'DNG-13458-m2',
        fromSupport: true,
        content: 'Could you share a screenshot of the error message you are seeing?',
        time: '4:40 PM',
      },
    ],
  },
  {
    id: 'DNG-13459',
    category: 'Dang Lifestyle',
    subject: 'Incorrect order total',
    message: 'The total amount charged on checkout does not match the items in the cart.',
    status: 'requires_action',
    submittedAt: 'Jul 30, 08:02 PM',
    updatedLabel: 'Fixed and deployed yesterday',
    messages: [
      {
        id: 'DNG-13459-m1',
        fromSupport: false,
        content: 'The total amount charged on checkout does not match the items in the cart.',
        time: '8:02 PM',
      },
      {
        id: 'DNG-13459-m2',
        fromSupport: true,
        content: "We've identified the issue and shipped a fix. Please try checking out again.",
        time: '9:15 AM',
      },
    ],
  },
]
