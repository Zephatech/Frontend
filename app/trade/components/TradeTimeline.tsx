import { classNames } from '@/app/_utils/styles/styles'
import {
    CheckCircleIcon,
    CheckIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
    MapPinIcon,
    UserIcon,
} from '@heroicons/react/20/solid'
import { Trade } from '@/app/_utils/api/trades'

export default function TradeTimeLine({ trade }: { trade: Trade }) {
    const timeline = []
    const createDate = new Date(trade.createdAt)

    // function formatDateTime(date: Date) {
    //     const month = (date.getMonth() + 1).toString().padStart(2, '0')
    //     const day = date.getDate().toString().padStart(2, '0')
    //     const year = date.getFullYear()
    //     const hours = date.getHours().toString().padStart(2, '0')
    //     const minutes = date.getMinutes().toString().padStart(2, '0')
    //     return `${month}/${day}/${year} ${hours}:${minutes}`
    // }
    function formatDateTimeWithTimezone(date: Date) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
            timeZone: 'America/Toronto',
        } as any

        return date.toLocaleString('en-US', options)
    }

    timeline.push({
        content: 'Requested',
        target: '',
        href: '#',
        date: formatDateTimeWithTimezone(createDate),
        datetime: trade.createdAt,
        icon: MapPinIcon,
        iconBackground: 'bg-blue-500',
    })

    if (trade.confirmedAt != '' && trade.confirmedAt != null) {
        const confirmDate = new Date(trade.confirmedAt)

        timeline.push({
            content: 'Confirmed',
            target: '',
            href: '#',
            date: formatDateTimeWithTimezone(confirmDate),
            datetime: trade.confirmedAt,
            icon: HandThumbUpIcon,
            iconBackground: 'bg-green-500',
        })
    }
    if (trade.endedAt != '' && trade.endedAt != null) {
        const endDate = new Date(trade.endedAt)

        timeline.push({
            content: 'Fulfilled',
            target: '',
            href: '#',
            date: formatDateTimeWithTimezone(endDate),
            datetime: trade.endedAt,
            icon: CheckCircleIcon,
            iconBackground: 'bg-yellow-500',
        })
    }
    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {timeline.map((event, eventIdx) => (
                    <li key={eventIdx}>
                        <div className="relative pb-8">
                            {eventIdx !== timeline.length - 1 ? (
                                <span
                                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span
                                        className={classNames(
                                            event.iconBackground,
                                            'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                                        )}
                                    >
                                        <event.icon
                                            className="h-5 w-5 text-white"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {event.content}{' '}
                                            <a
                                                href={event.href}
                                                className="font-medium text-gray-900"
                                            >
                                                {event.target}
                                            </a>
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                        <time dateTime={event.datetime}>
                                            {event.date}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
