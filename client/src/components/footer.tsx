export function Footer() {
  return (
    <footer className="bg-gaming-charcoal border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <i className="fas fa-gamepad text-gaming-gold text-2xl mr-3"></i>
              <h3 className="font-orbitron font-bold text-xl text-gaming-gold">GameHub Pro</h3>
            </div>
            <p className="text-gray-400">
              The platform advocates fairness, justice, and openness. We mainly operate fair lottery, 
              blockchain games, live casinos, and slot machine games.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">
                <i className="fab fa-discord text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Games</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Slots</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Casino</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Sports Betting</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Live Dealers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Responsible Gaming</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gaming-gold transition-colors duration-200">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              GameHub Pro works with more than 10,000 online live game dealers and slot games, all of which are verified fair games.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                Gambling can be addictive, please play rationally. GameHub Pro only accepts customers above the age of 18.
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">© 2024 GameHub Pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
