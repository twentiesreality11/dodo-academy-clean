import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="text-center py-12">
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 max-w-md mx-auto">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-yellow-700 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">Your payment was not completed. You can try again.</p>
        <Link href="/foundation/checkout" className="btn-primary inline-block">
          Try Again
        </Link>
      </div>
    </div>
  );
}