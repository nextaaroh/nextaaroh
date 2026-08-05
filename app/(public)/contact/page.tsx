export default function ContactPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Contact Us</h1>
      <p className="text-sm text-gray-600 mb-6">
        कोई सवाल, सुझाव या शिकायत है? हमें ईमेल कीजिए, हम जल्द जवाब देंगे।
      </p>
      <a href="mailto:nextaaroh@gmail.com" className="flex items-center gap-3 border border-gray-200 rounded-xl p-4">
        <span className="text-2xl">📧</span>
        <div>
          <p className="text-xs text-gray-400">Email us at</p>
          <p className="font-semibold text-orange-600">nextaaroh@gmail.com</p>
        </div>
      </a>
    </div>
  );
}
