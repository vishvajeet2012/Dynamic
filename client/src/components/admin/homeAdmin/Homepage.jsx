import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    LayoutGrid, 
    ImageIcon, 
    Info, 
    Image, 
    ShoppingBag, 
    Package 
} from 'lucide-react'; // Using lucide-react for clean icons

export default function HomePageControl() {
    // Array of control panel items for easier mapping and maintenance
    const controls = [
        {
            title: "Category Section",
            link: "/admincategory",
            icon: <LayoutGrid className="h-10 w-10 text-orange-500" />,
            description: "Manage product categories"
        },
        {
            title: "Banner Section",
            link: "/bannerMangement",
            icon: <ImageIcon className="h-10 w-10 text-orange-500" />,
            description: "Update homepage banners"
        },
        {
            title: "About Us Page",
            link: "/p/adminaboutUs",
            icon: <Info className="h-10 w-10 text-orange-500" />,
            description: "Edit the company info page"
        },
        {
            title: "Main Logo",
            link: "/homelogo",
            icon: <Image className="h-10 w-10 text-orange-500" />,
            description: "Change the main site logo"
        },
        {
            title: "Product Management",
            link: "/AdminProduct",
            icon: <ShoppingBag className="h-10 w-10 text-orange-500" />,
            description: "Add, edit, or remove products"
        },
        {
            title: "Order Management",
            link: "/adminorders", // Example for a new section
            icon: <Package className="h-10 w-10 text-orange-500" />,
            description: "View and process customer orders"
        }
    ];

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Creates a subtle stagger effect for each card
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center pb-4 border-b border-gray-200 mb-8">
                    <div className="text-2xl font-bold text-orange-500">
                        MyShop Admin
                    </div>
                    <div className="text-sm font-medium text-gray-500">Dashboard</div>
                </header>

                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        Home Page Control
                    </h1>
                    <p className="mt-3 text-lg text-gray-600">
                        Select a section to manage your website's content.
                    </p>
                </div>

                {/* Animated Grid of Control Cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {controls.map((control) => (
                        <Link to={control.link} key={control.title}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -5 }} // Animate on hover
                                whileTap={{ scale: 0.95 }}      // Animate on click
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col items-start"
                            >
                                <div className="bg-orange-100 p-3 rounded-lg mb-4">
                                    {control.icon}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {control.title}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {control.description}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}