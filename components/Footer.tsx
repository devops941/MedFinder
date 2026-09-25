const Footer = () => (
  <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-medblue-500 rounded flex items-center justify-center text-white mr-2">
              <i className="fa-solid fa-pills text-sm"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Med<span className="text-medblue-400">Finder</span></span>
          </div>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Making healthcare accessible by connecting patients with local pharmacies instantly. Find, reserve, and pick up with ease.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
        
        {/* Links Column 1 */}
        <div>
          <h4 className="text-lg font-semibold mb-6">For Customers</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Search Medicines</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Find Pharmacies</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">How it Works</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Customer Login</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Help Center</a></li>
          </ul>
        </div>
        
        {/* Links Column 2 */}
        <div>
          <h4 className="text-lg font-semibold mb-6">For Partners</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Register Pharmacy</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Staff Portal Login</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Partner API</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Success Stories</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Partner Support</a></li>
          </ul>
        </div>
        
        {/* Links Column 3 */}
        <div>
          <h4 className="text-lg font-semibold mb-6">Company</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-medblue-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-medblue-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; 2026 MedFinder Inc. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex space-x-6">
          <span><i className="fa-solid fa-globe mr-2"></i>English (US)</span>
          <a href="#" className="hover:text-white">Accessibility</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
