package br.com.calendar.controllers;

import br.com.calendar.SceneManager;
import javafx.beans.binding.Bindings;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Hyperlink;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.effect.BlurType;
import javafx.scene.effect.DropShadow;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Text;


public class LoginController {
    @FXML private TextField emailField;
    @FXML private PasswordField passwordField;

    @FXML private Label emailErrorLabel;
    @FXML private Label passwordErrorLabel;
    @FXML private Label generalErrorLabel;

    @FXML private Hyperlink forgotPasswordLink;
    @FXML private Hyperlink signupLink;
    @FXML private Button loginButton;


    @FXML private Text headlineMain;
    @FXML private Text headlineSecondary;

    @FXML private VBox formContent;
    @FXML private StackPane formPanel;

    @FXML private StackPane root;
    @FXML private HBox loginCard;



    @FXML
    public void initialize() {

    DropShadow shadowMain2 = new DropShadow(
        BlurType.GAUSSIAN,
        Color.rgb(0, 0, 0, 0.06),
        2,
        0,
        0,
        2
    );

    DropShadow shadowMain1 = new DropShadow(
        BlurType.GAUSSIAN,
        Color.rgb(0, 0, 0, 0.07),
        3,
        0,
        0,
        4
    );

    shadowMain1.setInput(shadowMain2);

    DropShadow shadowSecondary2 = new DropShadow(
        BlurType.GAUSSIAN,
        Color.rgb(0, 0, 0, 0.06),
        2,
        0,
        0,
        2
    );

    DropShadow shadowSecondary1 = new DropShadow(
        BlurType.GAUSSIAN,
        Color.rgb(0, 0, 0, 0.07),
        3,
        0,
        0,
        4
    );

    shadowSecondary1.setInput(shadowSecondary2);

    headlineMain.setEffect(shadowMain1);
    headlineSecondary.setEffect(shadowSecondary1);

    headlineMain.setOpacity(1.0);
    headlineSecondary.setOpacity(0.8);

    formContent.prefWidthProperty().bind(
    Bindings.max(
        320,
        Bindings.min(
            400,
            formPanel.widthProperty().subtract(200)
        )
    )
);

    formContent.maxWidthProperty().bind(
    formContent.prefWidthProperty()
);

    loginCard.prefWidthProperty().bind(
        Bindings.min(
        1200,
        root.widthProperty().subtract(80)
    )
);

    loginCard.prefHeightProperty().bind(
        Bindings.min(
        648,
        root.heightProperty().subtract(80)
    )
);

}
    @FXML
    private void handleLogin() {
        // Leaving for API integration later
    }

    @FXML
    private void handleGoogleLogin() {
        // Leaving for API integration later
    }

    @FXML
    private void handleGithubLogin() {
        // Leaving for API integration later
    }

    @FXML
    private void handleGoToSignup() {
        SceneManager.navigate("/signup");
    }

    @FXML
    private void handleGoToForgotPassword(){
        SceneManager.navigate("/esqueci-minha-senha");
    }

}
