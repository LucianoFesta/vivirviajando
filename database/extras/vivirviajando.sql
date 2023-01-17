-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-01-2023 a las 11:59:01
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vivirviajando`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `nombre`) VALUES
(1, 'Vuelo'),
(2, 'Hotel'),
(3, 'Paquete'),
(4, 'Actividad'),
(5, 'Oferta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id` int(11) NOT NULL,
  `id_usuario` varchar(50) NOT NULL,
  `totalCompra` decimal(10,2) NOT NULL,
  `formaPago` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `generos`
--

INSERT INTO `generos` (`id`, `nombre`) VALUES
(1, 'Masculino'),
(2, 'Femenino'),
(3, 'Otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `itemscompra`
--

CREATE TABLE `itemscompra` (
  `id` int(11) NOT NULL,
  `id_compra` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `cantidad` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mediospago`
--

CREATE TABLE `mediospago` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `mediospago`
--

INSERT INTO `mediospago` (`id`, `descripcion`) VALUES
(1, 'Visa Débito'),
(2, 'Visa Crédito'),
(3, 'MasterCard'),
(4, 'American Express'),
(5, 'Cabal'),
(6, 'Todas las Tarjetas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_categoria` int(15) NOT NULL,
  `imagen` varchar(100) NOT NULL,
  `info` varchar(300) NOT NULL,
  `servicio` varchar(100) NOT NULL,
  `precio` decimal(15,0) NOT NULL,
  `id_mediosPagos` int(40) NOT NULL,
  `descripcion` varchar(800) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `id_categoria`, `imagen`, `info`, `servicio`, `precio`, `id_mediosPagos`, `descripcion`) VALUES
(2, 'Tailandia', 1, '/images/products/1672174938041_product.jpg', ' Conocé lo mejor del Sudeste Asiático ', 'Vuelo desde Baires', '215000', 1, ' el vuelo inicia desde baires con destino a Bangkok. La primera escala es Dubai, con una espera de 8Hs y saliendo hacia Bangkok el día 18/02/2023 llegando a las 17;00Hs hora local. '),
(3, 'La Habana', 1, '/images/products/1672175421188_product.jpg', '  Visitá el caribe Cubano  ', 'Vuelo desde Córdoba', '185500', 6, '  El vuelo inicia el 08/02/2022 a las 08:00Hs desde Córdoba con destino a La Habana. La primer escala es en Panamá el 08/02/2022 a las 15:00 hora local en un vuelo operato por Copa Airlines y partiendo a las 17:30Hs con destino a La Habana.  '),
(4, 'Curazao', 1, '/images/products/1672184242891_product.jpg', ' No te pierdas la joya del caribe Holandes. ', 'Vuelo desde Rosario', '260000', 6, ' Vuelo desde Rosario con Avianca saliendo el 13/03/2023 con escala en Bogotá. LLegando a destino a la capital Willemstad a las 18:00Hs del 14/03/2023,  '),
(5, 'RIU Cancún', 2, '/images/products/1672184958278_product.jpg', '  Hotel 5 Estrellas - AllInclusive  ', 'Hotel en Cancún', '35500', 2, '  Disfruta de este maravilloso hotel con 5 restaurants, bebidas libres, habitaciones frente el mar o el patio, 3 piscinas y kayak gratuitos. Cuenta con servicio de estacionamiento y traslados desde y hacia el aeropuerto de manera gratuita.'),
(7, 'Snuba - Isla San Andrés', 4, '/images/products/1672229850349_product.jpg', 'Sumergite en el mar de los siete colores', 'Actividad en San Andrés', '5000', 6, 'Es una actividad en la cual podrás sumergirte hasta 10mts de profundidad acompañada por un tubo que te brindara oxígeno continuamente. Si tienen algo de miedo, no te preocupes! Te brindaran un pequeño curso para que puedas disfrutar al máximo.'),
(8, 'Hotel NYX Cancún', 2, '/images/products/1672230184337_product.jpg', '  El caribe Mexicano a tu alcance  ', 'Hotel en Cancún', '23000', 4, '  Este AllInclusive cuenta con 1 restaurant buffet con desayunador y bebidas libres todo el día. Servicio de playa. Un restaurant Japonés con reserva previa y un restaurant Italiano con reserva previa. Servicio de masajes, gimnasio y estacionamiento.  '),
(9, 'Seagarden Beach Resort', 2, '/images/products/1672230393451_product.jpg', ' Conoce la cuna del Reggae ', 'Hotel en Jamaica', '18000', 6, ' Este hotel 3 estrellas cuenta con restaurant buffet y restaurant de playa. Playa privada, pileta, servicio a la habitación, WIFI.  '),
(10, 'Dunns River Falls', 4, '/images/products/1672230712572_product.jpg', 'Disfruta de estas maravillosas cascadas en Jamaica', 'Actividad en Jamaica', '15000', 6, 'Las cascadas del río Dunn son únicas en el mundo. Podrás caminar 150mts por el medio de la cascada como si fuese una escalinata. El servicio incluye traslado desde los hoteles.'),
(11, 'Isla Johnny Kay', 4, '/images/products/1672231062225_product.jpg', 'Isla Johnny Kay en San Andrés', 'Actividad en San Andrés', '3500', 6, 'Esta maravillosa isla se encuentra a 20Km de la famosa Isla de San Andrés en Colombia. El servicio parte desde un punto de encuentro en incluye frutas y bebidas no alcohólicas.'),
(12, 'Buzios - Brasil', 3, '/images/products/1672231319502_product.jpg', 'Vuelos desde Córdoba + Hotel con desayuno', 'Paquete 7 Noches a Buzios', '175000', 6, 'Este paquete es desde el 03/04/2023 al 10/03/2023 para 2 personas en base doble. El vuelo sale desde Córdoba a las 05:00Hs con GOL y llega directo a destino a las 14:30Hs local. El hotel es el Caribbean Buzios 3 estrellas con desayuno incluido en base doble.'),
(13, 'Santiago de Chile', 3, '/images/products/1672231608668_product.jpg', 'Vuelo desde Mendoza + Hotel en Santiago de Chile', 'Paquete 5 noches', '118000', 6, 'Vuelo desde Mendoza saliendo a las 08:35Hs del 10/05/2023 via LATAM con equipaje de mano llegando a Santiago de Chile a las 10:45Hs. Hotel Chile único 3 estrellas con desayuno en base doble.'),
(14, 'Bariloche', 3, '/images/products/1672231802084_product.jpg', '5 noches en Bariloche desde Buenos Aires', 'Paquete 5 Noches', '85000', 6, 'Desde el 05/03/2023 al 10/03/2023 en base doble hotel NYX Bariloche con desayuno en base doble. Vuelo JetSmart saliendo el 05/03/2023 a las 11:30Hs llegando a destino a las 13:00Hs con traslado al hotel incluido.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productoseliminados`
--

CREATE TABLE `productoseliminados` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_categoria` int(15) NOT NULL,
  `imagen` varchar(100) NOT NULL,
  `info` varchar(300) NOT NULL,
  `servicio` varchar(100) NOT NULL,
  `precio` decimal(15,0) NOT NULL,
  `id_mediosPagos` int(11) NOT NULL,
  `descripcion` varchar(800) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipousuario`
--

CREATE TABLE `tipousuario` (
  `id` int(5) NOT NULL,
  `nombre` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipousuario`
--

INSERT INTO `tipousuario` (`id`, `nombre`) VALUES
(1, 'admin'),
(2, 'reader');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` varchar(100) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `id_tipoUsuario` int(11) NOT NULL,
  `id_genero` int(11) NOT NULL,
  `nacimiento` date NOT NULL,
  `documento` int(8) NOT NULL,
  `domicilio` varchar(50) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `provincia` varchar(50) NOT NULL,
  `fotoPerfil` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `confirmarPassword` varchar(100) NOT NULL,
  `condiciones` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `id_tipoUsuario`, `id_genero`, `nacimiento`, `documento`, `domicilio`, `ciudad`, `provincia`, `fotoPerfil`, `email`, `password`, `confirmarPassword`, `condiciones`) VALUES
('293c69d0-1898-4015-a530-da5456e978e3', 'Lucas Manuel', 'Festa', 2, 1, '1993-06-05', 37491218, 'Marconi 950', 'Morteros', 'Córdoba', '/images/users/1673016150943_user.JPG', 'lucasfesta@hotmail.com', '$2a$10$L.T8ltd99gxQJExDfLEjb.AH1O9xiqwTv2E.wJ0LSiE5tzQbvPL0a', '$2a$10$ctWtjvbIYYQF9HAwPuGnueqvg/3QITUjZ1KRn0JeIvgfV1TUMFvqK', 'on'),
('ac1487bb-4388-4f8b-8abf-497238a81ec5', 'Luciano Ezequiel', 'Festa', 1, 1, '1992-01-24', 36365939, 'Marconi 843', 'Morteros', 'Córdoba', '/images/users/1673266208461_user.JPG', 'lucianoefesta@hotmail.com', '$2a$10$wTraAt2g6QOZTFNDZAjzIOnkhT0RgIR.0xj/Tm6sRuOx3cDFovI2C', '$2a$10$J7sklMn94U8WGmeXC3H.Luk60nRw3FEzsq7cgXJEojCu.lxddfhNS', 'on');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `itemscompra`
--
ALTER TABLE `itemscompra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `mediospago`
--
ALTER TABLE `mediospago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categoria` (`id_categoria`) USING BTREE,
  ADD KEY `id_mediosPagos` (`id_mediosPagos`);

--
-- Indices de la tabla `productoseliminados`
--
ALTER TABLE `productoseliminados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_mediosPagos` (`id_mediosPagos`);

--
-- Indices de la tabla `tipousuario`
--
ALTER TABLE `tipousuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_genero` (`id_genero`),
  ADD KEY `id_tipoUsuario` (`id_tipoUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `itemscompra`
--
ALTER TABLE `itemscompra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mediospago`
--
ALTER TABLE `mediospago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `tipousuario`
--
ALTER TABLE `tipousuario`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `itemscompra`
--
ALTER TABLE `itemscompra`
  ADD CONSTRAINT `itemscompra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id`),
  ADD CONSTRAINT `itemscompra_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_mediosPagos`) REFERENCES `mediospago` (`id`);

--
-- Filtros para la tabla `productoseliminados`
--
ALTER TABLE `productoseliminados`
  ADD CONSTRAINT `productoseliminados_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `productoseliminados_ibfk_2` FOREIGN KEY (`id_mediosPagos`) REFERENCES `mediospago` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_genero`) REFERENCES `generos` (`id`),
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_tipoUsuario`) REFERENCES `tipousuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
