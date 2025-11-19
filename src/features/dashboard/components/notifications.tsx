import { useState } from 'react'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  MessageSquare,
  Users,
  ExternalLink,
  Search,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Notification {
  id: string
  title: string
  description: string
  type: 'info' | 'warning' | 'error' | 'success'
  source: 'system' | 'analytics' | 'email' | 'team' | 'integration'
  timestamp: string
  read: boolean
  important: boolean
  action?: {
    label: string
    url: string
  }
  metadata?: Record<string, string | number>
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New User Spike Detected',
      description:
        'Your website experienced a 142% increase in new users over the last 24 hours.',
      type: 'warning',
      source: 'analytics',
      timestamp: '2 hours ago',
      read: false,
      important: true,
      action: {
        label: 'View Report',
        url: '/analytics/audience',
      },
      metadata: { users: 1248, increase: '142%' },
    },
    {
      id: '2',
      title: 'Email Campaign Sent Successfully',
      description: 'Your weekly newsletter was delivered to 8,423 subscribers.',
      type: 'success',
      source: 'email',
      timestamp: '4 hours ago',
      read: true,
      important: false,
      action: {
        label: 'View Stats',
        url: '/email/campaigns/week-47',
      },
      metadata: { recipients: 8423, openRate: '28.7%' },
    },
    {
      id: '3',
      title: 'Payment Processing Issue',
      description:
        'One of your payment gateways failed to process 3 transactions.',
      type: 'error',
      source: 'system',
      timestamp: '6 hours ago',
      read: false,
      important: true,
      action: {
        label: 'Fix Now',
        url: '/settings/payments',
      },
      metadata: { failed: 3, amount: '$487.50' },
    },
    {
      id: '4',
      title: 'Team Member Commented',
      description:
        'Sarah from the design team added a comment on your dashboard layout.',
      type: 'info',
      source: 'team',
      timestamp: '1 day ago',
      read: false,
      important: false,
      action: {
        label: 'View Comment',
        url: '/team/dashboard-feedback',
      },
      metadata: { user: 'Sarah', project: 'Dashboard Redesign' },
    },
    {
      id: '5',
      title: 'New Integration Connected',
      description:
        'Google Analytics has been successfully connected to your account.',
      type: 'success',
      source: 'integration',
      timestamp: '1 day ago',
      read: true,
      important: false,
      action: {
        label: 'Explore Data',
        url: '/analytics',
      },
      metadata: { integration: 'Google Analytics', status: 'Connected' },
    },
    {
      id: '6',
      title: 'Server Maintenance Scheduled',
      description:
        'Your server will undergo maintenance on November 25th at 2:00 AM UTC.',
      type: 'warning',
      source: 'system',
      timestamp: '2 days ago',
      read: false,
      important: true,
      action: {
        label: 'View Details',
        url: '/settings/maintenance',
      },
      metadata: { date: 'Nov 25, 2:00 AM UTC', duration: '2 hours' },
    },
    {
      id: '7',
      title: 'New Feature Available',
      description:
        'The advanced segmentation feature is now available in your plan.',
      type: 'info',
      source: 'system',
      timestamp: '3 days ago',
      read: true,
      important: false,
      action: {
        label: 'Learn More',
        url: '/features/segmentation',
      },
      metadata: { feature: 'Advanced Segmentation', plan: 'Pro' },
    },
    {
      id: '8',
      title: 'Your Report is Ready',
      description:
        'The monthly traffic report for your e-commerce store is now available.',
      type: 'success',
      source: 'system',
      timestamp: '3 days ago',
      read: false,
      important: false,
      action: {
        label: 'Download Report',
        url: '/reports/monthly-ecommerce',
      },
      metadata: { report: 'Monthly E-commerce Report', format: 'PDF' },
    },
  ])

  const [selectedTab, setSelectedTab] = useState<
    'all' | 'unread' | 'important'
  >('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  )

  // Filter notifications based on tab and search
  const filteredNotifications = notifications
    .filter((notification) => {
      if (selectedTab === 'unread') return !notification.read
      if (selectedTab === 'important') return notification.important
      return true
    })
    .filter(
      (notification) =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )

  // Handle notification selection
  const toggleNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
    setSelectAll(!selectAll)
  }

  // Mark as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setSelectedNotifications([])
    setSelectAll(false)
  }

  // Delete selected
  const deleteSelected = () => {
    setNotifications((prev) =>
      prev.filter((n) => !selectedNotifications.includes(n.id))
    )
    setSelectedNotifications([])
    setSelectAll(false)
  }

  // Get notification type icon and color
  const getNotificationType = (type: string) => {
    const icons = {
      info: <MessageSquare className='h-4 w-4 text-blue-500' />,
      warning: <AlertCircle className='h-4 w-4 text-yellow-500' />,
      error: <AlertCircle className='h-4 w-4 text-red-500' />,
      success: <CheckCircle className='h-4 w-4 text-green-500' />,
    }
    const colors = {
      info: 'bg-blue-50 text-blue-800',
      warning: 'bg-yellow-50 text-yellow-800',
      error: 'bg-red-50 text-red-800',
      success: 'bg-green-50 text-green-800',
    }
    return {
      icon: icons[type as keyof typeof icons],
      color: colors[type as keyof typeof colors],
    }
  }

  // Get source icon
  const getSourceIcon = (source: string) => {
    const icons = {
      system: <Bell className='h-4 w-4' />,
      analytics: <BarChart3 className='h-4 w-4' />,
      email: <Mail className='h-4 w-4' />,
      team: <Users className='h-4 w-4' />,
      integration: <ExternalLink className='h-4 w-4' />,
    }
    return icons[source as keyof typeof icons]
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Notifications</h1>
          <p className='text-muted-foreground mt-1'>
            Stay updated with system alerts, analytics insights, and team
            activity
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={deleteSelected}
            disabled={selectedNotifications.length === 0}
          >
            Delete selected
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        {/* Search */}
        <div className='relative max-w-md flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <input
            type='text'
            placeholder='Search notifications...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border-input bg-background focus:ring-ring w-full rounded-md border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none'
          />
        </div>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={(value) =>
            setSelectedTab(value as 'all' | 'unread' | 'important')
          }
          className='flex-shrink-0'
        >
          <TabsList>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='unread'>
              Unread ({notifications.filter((n) => !n.read).length})
            </TabsTrigger>
            <TabsTrigger value='important'>
              Important ({notifications.filter((n) => n.important).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notification List */}
      <div className='space-y-4'>
        {filteredNotifications.length === 0 ? (
          <Card className='py-12 text-center'>
            <Bell className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h3 className='mb-1 text-lg font-medium'>No notifications found</h3>
            <p className='text-muted-foreground'>
              {searchTerm
                ? 'Try adjusting your search terms'
                : selectedTab === 'unread'
                  ? "You're all caught up!"
                  : "You're all caught up with your notifications"}
            </p>
          </Card>
        ) : (
          <>
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.read ? 'border-primary border-l-4' : ''
                } ${selectedNotifications.includes(notification.id) ? 'bg-muted' : ''}`}
              >
                <CardContent className='p-6'>
                  <div className='flex items-start gap-4'>
                    {/* Checkbox */}
                    <div className='pt-1'>
                      <Checkbox
                        id={`notification-${notification.id}`}
                        checked={selectedNotifications.includes(
                          notification.id
                        )}
                        onCheckedChange={() =>
                          toggleNotification(notification.id)
                        }
                      />
                    </div>

                    {/* Icon and Content */}
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-3'>
                          <div className='flex-shrink-0'>
                            {notification.important && (
                              <Badge
                                variant='destructive'
                                className='absolute -top-1 -right-1 z-10'
                              >
                                Important
                              </Badge>
                            )}
                            <div className='bg-muted rounded-lg p-2'>
                              {getSourceIcon(notification.source)}
                            </div>
                          </div>
                          <div className='min-w-0'>
                            <div className='mb-1 flex items-center gap-2'>
                              <h3 className='text-sm leading-tight font-medium'>
                                {notification.title}
                              </h3>
                              {notification.important && (
                                <Badge
                                  variant='destructive'
                                  className='text-xs'
                                >
                                  Important
                                </Badge>
                              )}
                            </div>
                            <p className='text-muted-foreground mb-3 line-clamp-2 text-sm'>
                              {notification.description}
                            </p>

                            {/* Metadata */}
                            {notification.metadata && (
                              <div className='mb-3 flex flex-wrap gap-2'>
                                {Object.entries(notification.metadata).map(
                                  ([key, value]) => (
                                    <Badge
                                      key={key}
                                      variant='outline'
                                      className='px-2 py-1 text-xs'
                                    >
                                      {key}: {value}
                                    </Badge>
                                  )
                                )}
                              </div>
                            )}

                            {/* Action button */}
                            {notification.action && (
                              <Button
                                variant='link'
                                size='sm'
                                className='text-primary hover:text-primary/80 h-auto p-0'
                                onClick={() => markAsRead(notification.id)}
                              >
                                {notification.action.label}
                                <ExternalLink className='ml-1 h-3 w-3' />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Notification type badge */}
                        <div className='ml-4 flex-shrink-0'>
                          <Badge
                            variant='outline'
                            className={`px-2 py-1 text-xs ${getNotificationType(notification.type).color}`}
                          >
                            {notification.type.charAt(0).toUpperCase() +
                              notification.type.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {/* Timestamp and read indicator */}
                      <div className='mt-3 flex items-center justify-between'>
                        <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                          <Clock className='h-3 w-3' />
                          {notification.timestamp}
                          {!notification.read && (
                            <span className='bg-primary h-2 w-2 animate-pulse rounded-full'></span>
                          )}
                        </div>

                        {!notification.read && (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => markAsRead(notification.id)}
                            className='h-6 px-2 text-xs'
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Bulk actions bar (shown when items selected) */}
      {selectedNotifications.length > 0 && (
        <div className='bg-background border-border fixed right-0 bottom-0 left-0 z-50 border-t px-6 py-4 shadow-lg'>
          <div className='mx-auto flex max-w-7xl items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Checkbox
                id='select-all-bulk'
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <span className='text-sm'>
                {selectedNotifications.length} selected
              </span>
            </div>

            <div className='flex items-center gap-3'>
              <Button variant='outline' size='sm' onClick={markAllAsRead}>
                Mark as read
              </Button>
              <Button variant='destructive' size='sm' onClick={deleteSelected}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification settings card */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Customize which notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>System Alerts</h3>
                <p className='text-muted-foreground text-sm'>
                  Receive notifications for server issues, maintenance, and
                  security events
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Analytics Insights</h3>
                <p className='text-muted-foreground text-sm'>
                  Get notified about traffic spikes, conversion changes, and
                  performance trends
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Email Campaigns</h3>
                <p className='text-muted-foreground text-sm'>
                  Receive status updates for your email marketing campaigns
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Team Activity</h3>
                <p className='text-muted-foreground text-sm'>
                  Get notified when team members comment on your projects
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Integration Updates</h3>
                <p className='text-muted-foreground text-sm'>
                  Receive notifications when connected services have status
                  changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Daily Digest</h3>
                <p className='text-muted-foreground text-sm'>
                  Receive a daily summary of all notifications (email)
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Email Notifications</h3>
                <p className='text-muted-foreground text-sm'>
                  Send important notifications to your email
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Push Notifications</h3>
                <p className='text-muted-foreground text-sm'>
                  Receive alerts on your mobile device
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className='mt-6 flex justify-end'>
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
